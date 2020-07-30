% WCC
% experiments of pca_spectrum
% 4-18-2020
classdef pca_spectrum_finding2 < handle
    %PCA_SPECTRUM_FINDING Summary of this class goes here
    %   Detailed explanation goes here
    
    properties
        p
    end
    
    methods
        
        function obj = pca_spectrum_finding2
            %PCA_SPECTRUM_FINDING Construct an instance of this class
            %   Detailed explanation goes here
            
            obj.p = pca_spectrum2.empty(8,0);
            
            % create the 8 objects
            for i = 1:8
                obj.p(i) = pca_spectrum2(i);
            end
            
            % adjust the polarity based on #1
%               for i = 1:8
%                   obj.p(i).adjust_polarity(obj.p(8));
%               end
             obj.p(4).adjust_polarity(obj.p(1)); %hard coded; only 4 and 8 need to change
             obj.p(8).adjust_polarity(obj.p(1));
             
             %for samples where polarity correction is needed, reverse
             %corresponding scores
             obj.p(4).score(:,1) = -obj.p(4).score(:,1); %negate L scores for colon
             obj.p(8).score(:,1) = -obj.p(8).score(:,1); %negate L scores for uterine cervix
                

            recolor(obj);

            %plot_scatter_3d (obj)
            
            %troubleshoot_mu (obj)
            
        end
        
        function recolor (obj)
            % reconstruct 8 images based on the PCA components of each other
            % WCC
            % 4-17-2020
            
            % define input images
            n = 1:8;
            
            % reconstuct images
            k = 1;
            for i = n
                for j = n
                    
                    rgb1 = pca_spectrum2.reconstruct(obj.p(i).score, obj.p(j).mu_masked, obj.p(j).coeff_masked, 1:3);
                    rgb2 = obj.p(i).rgb_1d_to_2d(rgb1);
                    
                    fn = sprintf('%d%d.png',i,j);
                    imwrite(rgb2,fn)
                    
                    subplot(size(n,2),size(n,2),k)
                    imshow(rgb2)
                    
                    k = k + 1;
                end
            end
            
            saveas(gcf,sprintf('%dx%d.png',size(n,2),size(n,2)))
            
            return
        end
        
        function plot_scatter_2d (obj)
            
            clf
            hold on
            for i = 1:8
                x1 = obj.p(i).score(:,1);
                y1 = obj.p(i).score(:,2);
                z1 = obj.p(i).score(:,3);
                
                range = 1:100:size(x1,1);
                
                subplot(2,4,i)
                %plot3(x1(range),y1(range),z1(range),'.')
                plot(x1(range),y1(range),'.')
                title(i)
                axis equal
            end
            
            saveas(gcf,sprintf('scatter_2d.png'))
            return
        end
        function troubleshoot_mu (obj)
            clf
            hold on
            
            
            for i=1:8
            j = 1;    
            subplot(8,2,i-1+j*i)
            image(obj.p(i).rgb2)
            axis off
            
            subplot(8,2,i+j*i)
            mu_kx3 = repmat(obj.p(i).mu_masked,obj.p(1).nrow*obj.p(1).ncol,1);
            mu_reshape = reshape(mu_kx3,obj.p(1).nrow,obj.p(1).ncol,3);
            rgbval = lab2rgb(mu_reshape);
            image(rgbval)
            title(sprintf('mu'))
            axis off
            saveas(gcf,sprintf('8xmu.png'))
            end
            
        end

        function plot_scatter_3d (obj)
            clf
            hold on
            for i = 1:8
                
                x1 = obj.p(i).coeff_masked(1,1)+obj.p(i).mu_masked(:,1);
                y1 = obj.p(i).coeff_masked(1,2)+obj.p(i).mu_masked(:,2);
                z1 = obj.p(i).coeff_masked(1,3)+obj.p(i).mu_masked(:,3);
                
                x2 = obj.p(i).coeff_masked(2,1)+obj.p(i).mu_masked(:,1);
                y2 = obj.p(i).coeff_masked(2,2)+obj.p(i).mu_masked(:,2);
                z2 = obj.p(i).coeff_masked(2,3)+obj.p(i).mu_masked(:,3);
                
                x3 = obj.p(i).coeff_masked(3,1)+obj.p(i).mu_masked(:,1);
                y3 = obj.p(i).coeff_masked(3,2)+obj.p(i).mu_masked(:,2);
                z3 = obj.p(i).coeff_masked(3,3)+obj.p(i).mu_masked(:,3);
                %range = 1:100:size(x1,1);
                
                subplot(2,4,i)
                plot3(x1,y1,z1,'o')
                hold on
                plot3(x2,y2,z2,'*')
                hold on
                plot3(x3,y3,z3,'.')
                hold off
                %plot(x1(range),y1(range),'.')
                title(i)
                xlabel('L')
                ylabel('a*')
                zlabel('b*')
                axis equal
                
            end
            
            saveas(gcf,sprintf('scatter_3d.png'))
            
            clf
            hold on
            for i = 1:8
                
                x1 = obj.p(i).coeff_masked(1,1);
                y1 = obj.p(i).coeff_masked(1,2);
                z1 = obj.p(i).coeff_masked(1,3);
                
                x2 = obj.p(i).coeff_masked(2,1);
                y2 = obj.p(i).coeff_masked(2,2);
                z2 = obj.p(i).coeff_masked(2,3);
                
                x3 = obj.p(i).coeff_masked(3,1);
                y3 = obj.p(i).coeff_masked(3,2);
                z3 = obj.p(i).coeff_masked(3,3);
                %range = 1:100:size(x1,1);
                
                subplot(2,4,i)
                plot3(x1,y1,z1,'o')
                hold on
                plot3(x2,y2,z2,'*')
                hold on
                plot3(x3,y3,z3,'.')
                hold off
                %plot(x1(range),y1(range),'.')
                title(i)
                xlabel('L')
                ylabel('a*')
                zlabel('b*')
                axis equal
                
            end
            
            saveas(gcf,sprintf('scatter_3d_nomu.png'))
            return
            
        end
        
        
        function plot_pca (obj)
            % save spectral analysis of 8 images
            % WCC
            % 4-17-2020
            
            % do PCA for all images
            for i = 1:8
                obj.p(i).create_plot;
                saveas(gcf,sprintf('spectral_%d.png',i))
            end
            
            return
        end
        
    end
    
end

