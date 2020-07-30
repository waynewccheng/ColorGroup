% PCA of spectral transmittance
% WCC
% 4-17-2020: change all variables to properties
% 4-17-2020: inheriting mypca.m
% 4-17-2020: inherited by @pca_spectrum
% 4-11-2020: add colormap
% 4-8-2020: using Paul's data

classdef pca_spectrum2 < handle
    
    properties
        
        % input data file locations
        organ_name
        transName_path
        imgTruthName_path
        cied65_path
        transName
        imgTruthName
        
        % image dimensions
        ncol
        nrow
        
    end
    
    properties
        
        % spectral data
        data
        data_masked
        
        % PCA coeff excluding background
        coeff_masked
        
        % PCA score excluding background
        score_masked

        latent
        tsquared
        explained
        mu_masked
        
        % PCA scores for all pixels including white background not included
        % in the pca() calculation
        score
        
        % non-white areas
        rgb
        rgb2
        rgb_masked
        rgb_masked2
        mask
        mask_index
        
    end
    
    methods
        
        function obj = pca_spectrum2 (organ_id)
            
            %
            % define variables for the input data
            %
            
            obj.define_input(organ_id);
            
            %
            % preprocess spectral data
            %
            %obj.data_conditioning; NOT NECESSARY FOR PCA ON LAB DATA?
            
            %
            % find white areas in the background
            %
            [obj.rgb_masked, obj.mask, obj.mask_index] = obj.find_non_white;
            
            %to check
            image(obj.rgb_masked2);
            
            % work on the masked pixels only
            %
            obj.data_masked = obj.data(obj.mask,:);
            
            %
            % Matlab pca
            %
            obj.do_pca(obj.data_masked);
            
            % calculate the score for all pixels including those white background not
            % included in pca()
            obj.score = (obj.data - obj.mu_masked) * inv(obj.coeff_masked');
            
            %
            % create final plot
            %
            % obj.create_plot;
            
        end
        
        function do_pca (obj,data_masked)
            % pca
            % great tutorial: http://www.cs.otago.ac.nz/cosc453/student_tutorials/principal_components.pdf
            % Matlab pca(): https://www.mathworks.com/help/stats/pca.html
            
            disp 'PCA'
            
            [obj.coeff_masked,obj.score_masked,obj.latent,obj.tsquared,obj.explained,obj.mu_masked] = pca(data_masked);

        end
        
        function define_input (obj,organ_id)
            %WCC = 1;
            
            % use Toy data to save time for debugging
            if organ_id == 0
                obj.ncol = 200;
                obj.nrow = 200;
                load('toy','data')
                obj.data = data;
                obj.organ_name = 'Toy';
                obj.imgTruthName = ['toy.png'];
                return
            end
            
            % data paths
            switch organ_id
                case 1
                    obj.organ_name = 'bladder';                    
                    load('bladderLAB.mat');
                case 2
                    obj.organ_name = 'brain';
                    load('brainLAB.mat');
                case 3
                    obj.organ_name = 'breast';
                    load('breastLAB.mat');
                case 4
                    obj.organ_name = 'colon';
                    load('colonLAB.mat');
                case 5
                    obj.organ_name = 'kidney';
                    load('kidneyLAB.mat');
                case 6
                    obj.organ_name = 'liver';
                    load('liverLAB.mat');
                case 7
                    obj.organ_name = 'lung';
                    load('lungLAB.mat');
                case 8
                    obj.organ_name = 'uterine cervix';
                    load('uterineLAB.mat');
            end
            
            % image size
            obj.ncol = 844;
            obj.nrow = 676;

            obj.data = LAB_array;
            clear;
        end
        
        %% data conditioning
        % huge difference in PCA!!!
        function data_conditioning (obj)
            
            disp 'Conditioning data'
            
            drange_scale = 0.01;
            
            % remove noisy 380 nm
            % by reducing magnitude
            % while keeping randomness
            drange1 = min(obj.data(:,1));
            drange2 = max(obj.data(:,1));
            obj.data(:,1) = obj.data(:,2) + obj.data(:,1) / (drange2-drange1) * drange_scale;
            
            % remove noise 780 nm
            % by reducing magnitude
            % while keeping randomness
            drange1 = min(obj.data(:,end));
            drange2 = max(obj.data(:,end));
            obj.data(:,end) = obj.data(:,end-1) + obj.data(:,end) / (drange2-drange1) * drange_scale;
            
            % trim to [0,1]
            %obj.data(obj.data < 0) = 0;
            %obj.data(obj.data > 1) = 1;
        end

        
        %% find the mask for the white background
        function [rgb_masked, mask, mask_index] = find_non_white (obj)

            disp 'Finding background'
            
            % lab for each pixel
            lab = obj.data;
            
            % sRGB for each pixel
            % notice that colormap requires range of [0,1]
            rgb = lab2rgb(lab);
            rgb_masked = rgb;
            
            % find the white point
            lab_max = max(lab(:,1));
            
            % select white pixels
            white_mask = abs(lab_max(:,1) - lab(:,1)) < 5;
            
            % color in green
            rgb_masked(white_mask,1:3) = repmat([0 1 0],nnz(white_mask),1);
            
            mask = ~white_mask;
            mask_index = find(~white_mask);
            
            % assign more values
            size(rgb)
            size(rgb_masked)
            
            obj.rgb_masked = rgb_masked;
            obj.rgb_masked2 = reshape(obj.rgb_masked,obj.nrow,obj.ncol,3);
            
            obj.rgb = rgb;
            obj.rgb2 = reshape(obj.rgb,obj.nrow,obj.ncol,3);
            
        end
        
        %
        % adjust the polarity
        %
        function adjust_polarity (obj, obj_ref)
            
            coeff1 = obj_ref.coeff_masked;
            coeff2 = obj.coeff_masked;
            score2 = obj.score_masked;
            
            [coeff2_new, score2_new] = pca_spectrum2.polarize_component (coeff1, coeff2, score2);
            
            obj.coeff_masked = coeff2_new;
            obj.score_masked = score2_new;
            
        end
        
        %
        % convert 1D rgb to 2D rgb using the image dimension
        %
        function rgb2 = rgb_1d_to_2d (obj, rgb1)
            rgb2 = reshape(rgb1,obj.nrow,obj.ncol,3);
        end
    end
    
    methods (Static)
        
        %
        % adjust component polarity by using corrcoef
        %
        function [coeff2_new, score2_new] = polarize_component (coeff1, coeff2, score2)
            
            coeff2_new = coeff2;
            score2_new = score2;
            
            for i = 1:3
                
                % column by column
                v1 = coeff1(:,i);
                v2 = coeff2(:,i);
                u2 = score2(:,i);
                
                % compare both polarities
                cor_plus = corrcoef(v1,v2);
                cor_minus = corrcoef(v1,-v2);
                
                % flip if needed
                if cor_minus(1,2) > cor_plus(1,2)
                    v2 = -v2;
                    u2 = -u2;
                end
                
                % put it back
                coeff2_new(:,i) = v2;
                score2_new(:,i) = u2;
            end
            
            return
        end
        
        %
        % reconstruct 1D rgb
        %
        function rgb = reconstruct (score_kx3, mu, coeff, component_to_use)
            
            % pca(): https://www.mathworks.com/help/stats/pca.html
            
            % how many vectors to use? // hard coded, so not needed here
%             for j = 1:3
%                 % set to 0 if not included in the vector
%                 if nnz(find(component_to_use==j))==0
%                     score_kx3(:,j) = 0;
%                 end
%             end
            
            % reconstruct the diff data
            %trans_diff_kx41 = score_kx41 * coeff';
            lab_diff_kx3 = score_kx3 * coeff';
            % add to mean
            %trans_kx41 = trans_diff_kx41 + repmat(mu,size(trans_diff_kx41,1),1);
            lab_kx3 = lab_diff_kx3 + repmat(mu,size(lab_diff_kx3,1),1);

            
            % CIELAB to sRGB
            rgb = uint8(lab2rgb(lab_kx3)*255);
            
            %             % 1D to 2D
            %             % image size
            %             ncol = 844;
            %             nrow = 676;
            %             rgb2 = reshape(rgb,nrow,ncol,3);
            
            %             % show image
            %             image(rgb2)
            %             axis off
            
            return
        end
        
    end
    
end

